import React, { Component } from 'react';
import { Input, Button, Popover, message, Modal, Select } from 'antd';
import styles from './index.less';

class ListPageHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonTitle: '',
            visible: false,
        };
    }

    /**
     * 传出标题内容
     */
    sendTitle = e => {
        this.props.getTitle(e.target.value);
    }

    /**
     * 添加按钮
     */
    addButton = e => {
        if (e.keyCode === 13) {
            const { buttons } = this.props;
            const { buttonTitle } = this.state;
            const newButtons = [...buttons];
            newButtons.push({
                title: buttonTitle,
            });
            this.setState({
                buttonTitle: '',
            });
            this.props.getButtons(newButtons);
        }
    }

    /**
     * 删除按钮
     */
    deleteButton = index => {
        const buttons = [...this.props.buttons];
        buttons.splice(index, 1);
        this.props.getButtons(buttons);
    }

    /**
     * 链接弹窗
     */
    linkPop = () => {
        if (this.props.popupForms.length === 0) {
            message.error('暂无弹窗');
        }
        this.setState({
            visible: true,
        });
    }

    render() {
        const { title, buttons, popupForms } = this.props;
        const { buttonTitle, visible } = this.state;

        return (
            <div className={styles.title}>
                <Input placeholder="页面标题" className={styles.titleInput} value={title} onChange={this.sendTitle} />
                <div>
                    {
                        buttons.map((item, index) => (
                            <Popover
                                trigger="hover"
                                content={(
                                    <>
                                        <span className={styles.deleteButton} onClick={() => this.deleteButton(index)}>删除</span>
                                        <span className={styles.deleteButtonLine}>|</span>
                                        <span className={styles.deleteButton} onClick={() => this.linkPop(index)}>链接弹窗</span>
                                    </>
                                )}
                                key={index}>
                                <Button type="primary" className={styles.button}>{item.title}</Button>
                            </Popover>
                        ))
                    }
                    <Input placeholder="回车添加操作按钮" className={styles.buttonInput} onChange={e => this.setState({ buttonTitle: e.target.value })} onKeyDown={this.addButton} value={buttonTitle} />
                </div>
                <Modal
                    title="弹窗列表"
                    visible={visible}>
                    <Select>
                        {
                            popupForms.map((item, index) => (
                                <Select.Option value={item.name} key={index}>
                                    {item.title}
                                    -
                                    {item.name}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Modal>
            </div>
        );
    }
}

export default ListPageHeader;
