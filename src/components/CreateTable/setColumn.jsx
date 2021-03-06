import React, { Component } from 'react';
import { Modal, InputNumber, Input, Form, Radio } from 'antd';
import { alignOptions, ellipsisOptions } from '@/utils/enum';

class SetColumn extends Component {
    /**
     * 配置列
     */
    setLine = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onOk(values);
            }
        });
    }

    /**
     * 关闭配置列弹窗
     */
    closeSetLine = () => {
        this.props.onCancel();
    }

    componentDidMount() {
        const { width, align, ellipsis, className } = this.props;
        this.props.form.setFieldsValue({
            width: width || undefined,
            align: align || undefined,
            ellipsis: ellipsis || undefined,
            className: className || undefined,
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { visibleSetColumn, zIndex } = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title="设置"
                visible={visibleSetColumn}
                onOk={this.setLine}
                onCancel={this.closeSetLine}
                zIndex={zIndex}>
                <Form {...formItemLayout}>
                    <Form.Item
                        label="width">
                        {getFieldDecorator('width')(
                            <InputNumber />,
                        )}
                    </Form.Item>
                    <Form.Item
                        label="align">
                        {getFieldDecorator('align')(
                            <Radio.Group options={alignOptions} />,
                        )}
                    </Form.Item>
                    <Form.Item
                        label="ellipsis">
                        {getFieldDecorator('ellipsis')(
                            <Radio.Group options={ellipsisOptions} />,
                        )}
                    </Form.Item>
                    <Form.Item
                        label="className">
                        {getFieldDecorator('className')(
                            <Input />,
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const SetColumnForm = Form.create({ name: 'set_column' })(SetColumn);

export default SetColumnForm;
